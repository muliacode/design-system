import type { UserEvent } from '@testing-library/user-event';

/**
 * Presses Tab `count` times and returns a short description of each element
 * that received focus, so a test can assert the whole tab order at once:
 *
 *   expect(await tabOrder(user, 3)).toEqual(['button: Save', 'link: Cancel', 'body']);
 *
 * Landing on `body` means focus left the component; a test can check that
 * nothing traps it.
 */
export async function tabOrder(user: UserEvent, count: number, options: { shift?: boolean } = {}): Promise<string[]> {
    const order: string[] = [];
    for (let i = 0; i < count; i++) {
        await user.tab({ shift: options.shift ?? false });
        order.push(describe(document.activeElement));
    }
    return order;
}

function describe(element: Element | null): string {
    if (element === null || element === document.body) {
        return 'body';
    }
    const role = element.getAttribute('role') ?? element.tagName.toLowerCase();
    const name = element.getAttribute('aria-label') ?? element.textContent?.trim() ?? '';
    return name === '' ? role : `${role}: ${name}`;
}
