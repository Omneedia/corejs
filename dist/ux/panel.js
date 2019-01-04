App.define("ux.panel", {
    require: [
        "ux.component"
    ],
    extend: "ux.component",
    properties: {
        items: []
    },
    methods: {
        update: function (html) {
            this.html = html;
            this.render();
        }
    },
    constructor: function (config) {
        /*console.log('----');
        console.log(config);
        console.log('----');*/
        config.x.render();
    }
});