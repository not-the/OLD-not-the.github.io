// Obfuscation
document.querySelector('[data-obfuscated]').addEventListener("click", e => {
    let value = '&#x63;&#x6F;&#x6E;&#x74;&#x61;&#x63;&#x74;&#x40;&#x6E;&#x6F;&#x74;&#x6B;&#x61;&#x6C;&#x2E;&#x63;&#x6F;&#x6D;';
    let [a, b, c, d] = ['al.com', '@notk', 'con', 'tact'];
    const button = e.currentTarget;
    let element = document.createElement('a');
    [element.href, element.target, element.rel] = [`mailto:${c}${d}${b}${a}`, "_blank", "noreferrer"];
    element.innerHTML = `${value}`;
    button.replaceWith(element);
})