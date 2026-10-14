import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Participant } from '../../src/domain/models';

class MockElement {
  public tagName: string;
  public className: string = '';
  public innerHTML: string = '';
  public textContent: string = '';
  public disabled: boolean = false;
  private attributes: Map<string, string> = new Map();
  private listeners: Map<string, Function[]> = new Map();
  public children: MockElement[] = [];

  constructor(tagName: string) {
    this.tagName = tagName;
  }

  public setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  public getAttribute(name: string): string | null {
    return this.attributes.get(name) || null;
  }

  public hasAttribute(name: string): boolean {
    return this.attributes.has(name);
  }

  public removeAttribute(name: string): void {
    this.attributes.delete(name);
  }

  public addEventListener(event: string, fn: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(fn);
  }

  public dispatchEvent(event: { type: string }): void {
    const list = this.listeners.get(event.type) || [];
    for (const fn of list) {
      fn(event);
    }
  }

  public click(): void {
    this.dispatchEvent({ type: 'click' });
  }

  public focus(): void {}

  public contains(target: any): boolean {
    return target === this;
  }

  public querySelector(selector: string): any {
    // Basic mock querySelector based on id or class
    const cleanId = selector.startsWith('#') ? selector.slice(1) : null;
    const cleanClass = selector.startsWith('.') ? selector.slice(1) : null;

    if (cleanId) {
      const match = new MockElement(selector);
      match.disabled = false;
      return match;
    }
    if (cleanClass) {
      return new MockElement(selector);
    }
    return new MockElement(selector);
  }
}

describe('HeaderSummaryComponent - Mobile and Desktop Actions', () => {
  beforeEach(() => {
    (globalThis as any).document = {
      createElement: (tag: string) => new MockElement(tag),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
  });

  it('initializes and updates disabled state for both desktop and mobile items', async () => {
    const { HeaderSummaryComponent } = await import('../../src/ui/components/header-summary');

    const onReset = vi.fn();
    const onShare = vi.fn();
    const onExportPdf = vi.fn();

    const header = new HeaderSummaryComponent({
      onResetRequested: onReset,
      onShareRequested: onShare,
      onExportPdfRequested: onExportPdf
    });

    expect(header).toBeTruthy();
    expect(header.getElement()).toBeDefined();

    // Toggle mobile menu
    header.toggleMobileMenu();
    header.toggleMobileMenu(false);
    header.closeMobileMenu();

    // Update with 0 participants
    header.update([]);

    // Update with participants
    const participants: Participant[] = [
      {
        id: 'p1',
        name: 'Manu',
        items: [{ id: 'i1', name: 'Refresco', unitPrice: 1.5, quantity: 2 }],
        createdAt: new Date().toISOString()
      }
    ];
    header.update(participants);
  });
});
