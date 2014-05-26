var STATE_BEGAN = 1;
var STATE_CHANGED = 2;
var STATE_ENDED = 4;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 8;

var STATE_POSSIBLE = 16;
var STATE_FAILED = 32;

function Recognizer(inst, options) {
    this.inst = inst;
    inst.recognizers.push(this);

    this.state = STATE_POSSIBLE;
    this.enabled = true;

    this.options = merge(options || {}, this.defaults);
}

Recognizer.prototype = {
    /**
     * reset the state
     */
    reset: function() {
        this.state = STATE_POSSIBLE;
    },

    /**
     * default handler
     * @param input
     */
    handler: function(input) {
        this.inst.trigger(this.options.event + this.statePostfix(), input);
    },

    /**
     * used for event triggers
     * @returns {string}
     */
    statePostfix: function() {
        var state = this.state;
        if(state === STATE_BEGAN) {
            return 'start';
        } else if(state === STATE_ENDED) {
            return 'end';
        } else if(state === STATE_CANCELLED) {
            return 'cancel';
        }
        return '';
    },

    /**
     * update the recognizer
     * @param inputData
     */
    update: function(inputData) {
        // get detection state
        if(this.state <= STATE_POSSIBLE) {
            this.state = this.test(inputData);
        }

        // call the handler for valid tests
        if(this.state <= STATE_CANCELLED) {
            this.handler(inputData);
        }

        if(inputData.isFinal) {
            this.reset();
        }
    }
};
