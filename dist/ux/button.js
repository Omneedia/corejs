App.define("ux.button", {
    require: [
        "ux.component"
    ],
    extend: "ux.component",
    properties: {
        text: "--toto"
    },
    events: {

    },
    methods: {
        setValue: function (value) {
            this.text = value;
        }
    },
    constructor: function (o) {

    }
});