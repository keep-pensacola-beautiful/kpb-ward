/**
 * After a millisecond delay specified by delayMs has ellapsed, scrolls to the top of the current page
 * and focuses the element matching anElementId.
 * @param anElementId 
 * @param delayMs 
 */
export function scrollToTopAndFocusAnElementById(anElementId: string, delayMs: number): void {
    setTimeout(() => {
        const anElement = document.getElementById(anElementId);
        if (anElement) {
            anElement.focus();
            window.scroll(0, 0);
        }
    }, delayMs);
}