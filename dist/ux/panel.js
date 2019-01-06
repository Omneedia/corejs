App.define("ux.panel", {
    dependencies: {
        "Ionic": "@ionic/core@latest/dist/ionic.js"
    },
    require: [
        "ux.component"
    ],
    extend: "ux.component",
    properties: {
        items: [],
        bodyStyle: "",
        left: -1,
        top: -1,
        width: -1,
        height: -1
    },
    methods: {
        render: function (config) {
            this.dom = App.$(this.renderTo);
            if (this.bodyStyle != -1) {
                for (var el in this.bodyStyle) this.dom.css(el, this.bodyStyle[el]);
            };
            if (this.height != -1) this.dom.css('height', this.height + 'px');
            if (this.width != -1) this.dom.css('width', this.width + 'px');
            if (this.top != -1) {
                this.dom.css('position', 'absolute');
                this.dom.css('top', this.top + 'px');
            };
            if (this.left != -1) {
                this.dom.css('position', 'absolute');
                this.dom.css('left', this.left + 'px');
            };
            this.dom.html(this.html);
        },
        update: function (html) {
            this.html = html;
            this.render();
        }
    },
    constructor: function (config) {
        config.$this.render(config);
    }
});