class App {
    constructor() {
        this.canvas = new SlideCanvas();
        $("body").append(this.canvas.render());

        //this.canvas.addElement(new SimpleContainer());
        this.canvas.addElement(new FlexContainer());

        this.canvas.layout(false);
        $(window).on("resize", () => {
            this.canvas.layout(false);
        });
    }
}

class SlideCanvas {
    render() {
        this.$el = $("<div/>").addClass("canvas");
        return this.$el;
    }

    layout(animate) {
        var padding = 50;
        var canvasWidth = window.innerWidth - padding * 2;
        var canvasHeight = window.innerHeight - padding * 2;

        this.$el.css("left", padding + "px").css("top", padding + "px").width(canvasWidth).height(canvasHeight);

        if (this.element) {
            this.element.layout({
                left: 0,
                top: 0,
                width: canvasWidth,
                height: canvasHeight
            }, animate);
        }
    }

    addElement(element) {
        this.element = element;
        this.element.canvas = this;

        this.$el.append(element.render());
        element.renderUI();
    }
}

class BaseElement {
    render() {
        this.$el = $("<div/>");
        this.$el.addClass("element");
        return this.$el;
    }

    layout(bounds, animate) {
        if (animate) {
            this.$el.animate(bounds);
        } else{
            this.$el.css(bounds);
        }
    }

    renderUI() {

    }
}

class SimpleBox extends BaseElement {
    constructor(label) {
        super();
        this.label = label;
    }

    render() {
        this.$el = $("<div/>");
        this.$el.addClass("element simplebox");

        this.$el.text(this.label);

        return this.$el;
    }
}

class SimpleContainer extends BaseElement {
    constructor() {
        super();
        this.childElements = [];
    }

    render() {
        this.$el = $("<div/>");
        this.$el.addClass("element");

        this.addChildElement(new SimpleBox("SimpleBox"));

        return this.$el;
    }

    layout(bounds){
        this.childElements[0].layout(bounds);
    }

    renderUI() {
        var $button = $("<div/>").addClass("control").text("Change Color");
        this.$el.append($button);

        $button.on("click", () => {
            this.childElements[0].$el.css("background", "orange");
        });
    }

    addChildElement(element) {
        this.childElements.push(element);
        element.parentElement = this;

        this.$el.append(element.render());
        element.renderUI();
    }
}

class FlexContainer extends SimpleContainer {

    render() {
        this.$el = $("<div/>");
        this.$el.addClass("element");
        this.addNewBox();

        return this.$el;
    }

    renderUI() {
        var $button = $("<div/>").addClass("control").text("Add Item");
        this.$el.prepend($button);

        $button.on("click", () => {
            this.addNewBox();
        });
    }

    layout() {
        var leftOffset = 50;
        
        //i.e. 50 pixel padding on either side, minus 20 for every child
        var availableWidth = this.canvas.$el.width() - 100 - (20 * (this.childElements.length - 1));

        this.childElements.forEach((elem, index, children) => {
            var elemWidth = availableWidth / children.length;

            elem.layout({
                height: '100px',
                width: elemWidth,
                top: this.canvas.$el.height() / 2 - 50,
                left: leftOffset
            });
            leftOffset = leftOffset + elemWidth + 20;
        });
    }

    addNewBox() {
        var newBox = new SimpleBox(this.childElements.length);
        this.addChildElement(newBox);
        this.layout();
    }

}

