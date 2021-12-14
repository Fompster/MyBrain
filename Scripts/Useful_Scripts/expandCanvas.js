// Expands all canvases with the expanded-canvas class to their parent's size (minus the padding)
// The script has to be places last or after all the canvases to enlarge all of them

let canvases = document.getElementsByClassName("expanded-canvas");
function sizeCanvas() {
    var parentCssProperties, paddingHorizontal, paddingVertical;

    for (var i = 0; i < canvases.length; i++) {
        parentCssProperties = window.getComputedStyle(canvases[i].parentElement, null);
        paddingHorizontal = parseInt(parentCssProperties.getPropertyValue('padding-left')) + parseInt(parentCssProperties.getPropertyValue('padding-right'));
        paddingVertical = parseInt(parentCssProperties.getPropertyValue('padding-top')) + parseInt(parentCssProperties.getPropertyValue('padding-bottom'));

        canvases[i].width  = canvases[i].parentElement.clientWidth - paddingHorizontal;
        canvases[i].height = canvases[i].parentElement.clientHeight - paddingVertical;
    }
}
window.addEventListener('resize', sizeCanvas);
sizeCanvas();