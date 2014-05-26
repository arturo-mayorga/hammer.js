Hammer.defaults = {
    touchAction: 'pan-y'
};

/**
 * Hammer instance for an element
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Instance(element, options) {
    this.element = element;
    this.options = merge(options || {}, Hammer.defaults);

    this.session = {};
    this.recognizers = [];

    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this);
}

Instance.prototype = {
    update: function(inputData) {
        this.touchAction.update(inputData);
        each(this.recognizers, function(recognizer) {
            recognizer.update(inputData);
        });
    },

    /**
     * destroy the instance
     */
    destroy: function() {
        this.session = {};
        this.input.destroy();
        this.element = null;
    },

    /**
     * @param {String} gesture
     * @param {Object} eventData
     */
    trigger : function(gesture, eventData) {
        // create DOM event
        var event = document.createEvent('Event');
        event.initEvent(gesture, true, true);
        event.gesture = eventData;

        console.log(gesture);

        this.element.dispatchEvent(event);
    }
};
