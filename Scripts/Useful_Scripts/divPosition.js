// Get a div's exact position on the page
export function getPosition(div) {
    var xPos = 0;
    var yPos = 0;

    while (div) {
        if (div.tagName == "BODY") {
        // deal with browser quirks with body/window/document and page scroll
        var xScroll = div.scrollLeft || document.documentElement.scrollLeft;
        var yScroll = div.scrollTop || document.documentElement.scrollTop;

        xPos += (div.offsetLeft - xScroll + div.clientLeft);
        yPos += (div.offsetTop - yScroll + div.clientTop);

        } else {
        // for all other non-BODY elements
        xPos += (div.offsetLeft - div.scrollLeft + div.clientLeft);
        yPos += (div.offsetTop - div.scrollTop + div.clientTop);
        }

        div = div.offsetParent;
    }
    return {
        x: xPos,
        y: yPos
    };
};