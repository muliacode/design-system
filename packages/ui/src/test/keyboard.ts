import type { UserEvent } from '@testing-library/user-event';
import { computeAccessibleName } from 'dom-accessibility-api';

/**
 * Presses Tab `count` times and returns each focused element as
 * "role: accessible name", so a test can assert the whole tab order at once:
 *
 *   expect(await tabOrder(user, 3)).toEqual(['button: Save', 'link: Cancel', 'body']);
 *
 * Roles are the ARIA roles a screen reader announces, implicit ones included
 * (an `<a href>` is a link), and names are computed as browsers do. Landing on
 * `body` means focus left the component; a test can check nothing traps it.
 */
export async function tabOrder(user: UserEvent, count: number, options: { shift?: boolean } = {}): Promise<string[]> {
    const order: string[] = [];
    for (let i = 0; i < count; i++) {
        await user.tab({ shift: options.shift ?? false });
        order.push(describeFocus(document.activeElement));
    }
    return order;
}

function describeFocus(element: Element | null): string {
    if (element === null || element === document.body) {
        return 'body';
    }
    const role = roleOf(element);
    const name = computeAccessibleName(element);
    return name === '' ? role : `${role}: ${name}`;
}

// Implicit roles of the elements that can take focus (HTML-AAM).
const inputRoles: Record<string, string> = {
    button: 'button',
    checkbox: 'checkbox',
    email: 'textbox',
    image: 'button',
    number: 'spinbutton',
    radio: 'radio',
    range: 'slider',
    reset: 'button',
    search: 'searchbox',
    submit: 'button',
    tel: 'textbox',
    text: 'textbox',
    url: 'textbox',
};

function roleOf(element: Element): string {
    const explicit = element.getAttribute('role')?.trim().split(/\s+/)[0];
    if (explicit) {
        return explicit;
    }
    switch (element.tagName) {
        case 'A':
        case 'AREA':
            return element.hasAttribute('href') ? 'link' : 'generic';
        case 'BUTTON':
        case 'SUMMARY':
            return 'button';
        case 'INPUT':
            return inputRoles[(element as HTMLInputElement).type] ?? 'textbox';
        case 'SELECT':
            return (element as HTMLSelectElement).multiple || (element as HTMLSelectElement).size > 1 ? 'listbox' : 'combobox';
        case 'TEXTAREA':
            return 'textbox';
        case 'DIALOG':
            return 'dialog';
        default:
            return element.tagName.toLowerCase();
    }
}
