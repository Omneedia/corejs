App.define("ux.component", {
    properties: {
        html: ""
    },
    methods: {
        render: function () {
            this.renderTo.html(this.html);
        }
    },
    constructor: function (config) {

    }
});