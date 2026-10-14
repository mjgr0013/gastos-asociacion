import { formatCurrency } from '../domain/calculations';
import { ConsumptionItem, Participant, QuickCatalogPreset, SessionState } from '../domain/models';
import { generateSessionShareText } from '../domain/sharing';
import { SessionStore } from '../storage/store';
import { shareOrCopyText } from '../utils/share';
import { ConfirmDialogComponent } from './components/confirm-dialog';
import { ConsumptionFormComponent, CustomConsumptionPayload } from './components/consumption-form';
import { HeaderSummaryComponent } from './components/header-summary';
import { ParticipantCardComponent } from './components/participant-card';
import { ParticipantFormComponent } from './components/participant-form';
import { ToastComponent } from './components/toast';

export class AppView {
  private container: HTMLElement;
  private store: SessionStore;
  private headerSummary: HeaderSummaryComponent;
  private participantForm: ParticipantFormComponent;
  private participantsListContainer: HTMLElement;
  private activeModal: ConsumptionFormComponent | null = null;
  private collapsedParticipantIds: Set<string> = new Set();

  constructor(container: HTMLElement, store: SessionStore) {
    this.container = container;
    this.store = store;

    this.container.innerHTML = `
      <div id="storage-warning-banner" class="storage-warning-banner" role="status" hidden>
        ⚠️ El almacenamiento local del navegador no está disponible. Los datos se mantendrán en memoria durante la partida, pero se perderán si recargas la página.
      </div>
      <div id="header-mount"></div>
      <main class="main-content">
        <div id="form-mount"></div>
        <section class="participants-section" aria-label="Participantes de la mesa">
          <div id="participants-list" class="participants-grid"></div>
        </section>
      </main>
    `;

    // Banner de advertencia de almacenamiento (FR-009, SC-003, T025)
    if (!this.store.isStorageAvailable()) {
      const banner = this.container.querySelector('#storage-warning-banner') as HTMLElement;
      if (banner) {
        banner.hidden = false;
      }
    }

    // Cabecera de resumen
    this.headerSummary = new HeaderSummaryComponent({
      onResetRequested: () => this.handleResetSession(),
      onShareRequested: () => this.handleShareSession()
    });
    this.container.querySelector('#header-mount')?.appendChild(this.headerSummary.getElement());

    // Formulario de participante
    this.participantForm = new ParticipantFormComponent({
      onSubmit: (name) => this.handleAddParticipant(name)
    });
    this.container.querySelector('#form-mount')?.appendChild(this.participantForm.getElement());

    this.participantsListContainer = this.container.querySelector('#participants-list') as HTMLElement;

    // Suscripción al almacén de estado
    this.store.subscribe((state) => this.renderState(state));
  }

  private renderState(state: Readonly<SessionState>): void {
    // Actualizar cabecera con subtotales y total global
    this.headerSummary.update(state.participants);

    // Renderizar lista de participantes
    this.participantsListContainer.innerHTML = '';

    if (state.participants.length === 0) {
      this.participantsListContainer.innerHTML = `
        <div class="empty-session-state">
          <div class="empty-icon">🎲</div>
          <h2 class="empty-title">La mesa está vacía</h2>
          <p class="empty-description">
            Añade a los jugadores de la partida en el campo superior para empezar a registrar consumiciones.
          </p>
        </div>
      `;
      return;
    }

    state.participants.forEach((participant) => {
      const card = new ParticipantCardComponent({
        participant,
        isCollapsed: this.collapsedParticipantIds.has(participant.id),
        onToggleCollapse: (pId) => this.handleToggleCollapse(pId),
        onSelectPreset: (pId, preset) => this.handleSelectPreset(pId, preset),
        onOpenCustomForm: (p) => this.handleOpenCustomForm(p),
        onUpdateQuantity: (pId, itemId, newQty) => this.handleUpdateQuantity(pId, itemId, newQty),
        onRequestRemoveItem: (p, item) => this.handleRequestRemoveItem(p, item),
        onRemoveItem: (pId, itemId) => {
          const participant = state.participants.find((p) => p.id === pId);
          const item = participant?.items.find((i) => i.id === itemId);
          if (participant && item) {
            this.handleRequestRemoveItem(participant, item);
          } else {
            this.store.removeConsumption(pId, itemId);
          }
        },
        onRequestDeleteParticipant: (p) => this.handleRequestDeleteParticipant(p)
      });
      this.participantsListContainer.appendChild(card.getElement());
    });
  }

  private handleToggleCollapse(participantId: string): void {
    if (this.collapsedParticipantIds.has(participantId)) {
      this.collapsedParticipantIds.delete(participantId);
    } else {
      this.collapsedParticipantIds.add(participantId);
    }
    this.renderState(this.store.getState());
  }

  private handleAddParticipant(name: string): void {
    this.store.addParticipant(name);
  }

  private handleSelectPreset(participantId: string, preset: QuickCatalogPreset): void {
    this.store.addConsumption(participantId, {
      name: preset.name,
      unitPrice: preset.unitPrice,
      quantity: 1
    });
  }

  private handleOpenCustomForm(participant: Participant): void {
    if (this.activeModal) {
      this.activeModal.destroy();
    }

    this.activeModal = new ConsumptionFormComponent({
      participantName: participant.name,
      onSubmit: (payload: CustomConsumptionPayload) => {
        this.store.addConsumption(participant.id, payload);
        this.activeModal?.destroy();
        this.activeModal = null;
      },
      onCancel: () => {
        this.activeModal?.destroy();
        this.activeModal = null;
      }
    });

    this.activeModal.mount(this.container);
  }

  private handleUpdateQuantity(participantId: string, itemId: string, newQty: number): void {
    this.store.updateConsumptionQuantity(participantId, itemId, newQty);
  }

  private async handleRequestRemoveItem(participant: Participant, item: ConsumptionItem): Promise<void> {
    const formattedPrice = formatCurrency(item.unitPrice);
    const confirmed = await ConfirmDialogComponent.show({
      title: '¿Eliminar consumición?',
      message: `¿Seguro que deseas eliminar "${item.name}" (${item.quantity} x ${formattedPrice}) de ${participant.name}?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      isDanger: true
    });

    if (confirmed) {
      this.store.removeConsumption(participant.id, item.id);
    }
  }

  private async handleRequestDeleteParticipant(participant: Participant): Promise<void> {
    if (participant.items.length > 0) {
      const confirmed = await ConfirmDialogComponent.show({
        title: '¿Eliminar participante?',
        message: `¿Seguro que deseas eliminar a "${participant.name}" y todas sus consumiciones registradas?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDanger: true
      });

      if (!confirmed) return;
    }

    this.collapsedParticipantIds.delete(participant.id);
    this.store.removeParticipant(participant.id);
  }

  private async handleResetSession(): Promise<void> {
    const state = this.store.getState();
    if (state.participants.length === 0) {
      return;
    }

    const confirmed = await ConfirmDialogComponent.show({
      title: '¿Reiniciar la sesión?',
      message:
        'Se vaciará toda la mesa y se borrarán todos los participantes y consumiciones acumuladas. Esta acción no se puede deshacer.',
      confirmText: 'Sí, reiniciar mesa',
      cancelText: 'Cancelar',
      isDanger: true
    });

    if (confirmed) {
      this.collapsedParticipantIds.clear();
      this.store.resetSession();
    }
  }

  private async handleShareSession(): Promise<void> {
    const state = this.store.getState();
    if (state.participants.length === 0) {
      return;
    }

    const shareText = generateSessionShareText(state.participants);
    const result = await shareOrCopyText({
      title: 'Cuenta de la partida',
      text: shareText
    });

    if (result === 'copied') {
      ToastComponent.show('¡Resumen copiado al portapapeles!');
    } else if (result === 'error') {
      ToastComponent.show('No se pudo compartir ni copiar automáticamente.');
    }
  }
}
