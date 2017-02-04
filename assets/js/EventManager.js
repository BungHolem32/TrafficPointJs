(function () {

    /*================================================CHALLENGE ONE=================================================== */
    var EventManager = function () {

        return Object.create(null, {

            events: {
                value: {},
                configurable: true,
                enumerable: true
            },

            on: {
                value: function (eventName, callback, onEventData) {

                    //Splice the name of the event to 2 parts;
                    var categoryName = eventName.substring(0, eventName.indexOf(':'));
                    var status = eventName.substring(eventName.indexOf(':') + 1);
                    var paramName = getParamNames(callback);

                    // Create the event's  if not yet created
                    if (!this.events.hasOwnProperty.call(this.events, categoryName)) this.events[categoryName] = [];

                    //Push the new events to the event array
                    this.events[categoryName].push(status + paramName, function (triggerData) {
                        return function () {
                            callback.call(onEventData, triggerData, onEventData);
                        }
                    })
                },
                configurable: true,
                enumerable: true
            },


            off: {
                value: function (eventName, callback) {

                    //split the name of the the event
                    var categoryName = eventName.substring(0, eventName.indexOf(':'));

                    //get the parameter name in the callback and then check if it in the array then delete it
                    var callbackParamName = getParamNames(callback);

                    //run over all the events and remove the selected callback
                    this.events[categoryName].map(function (index, e) {
                        if (typeof e == 'string') {
                            if (e.indexOf(callbackParamName[0]) != -1) {
                                delete this.events[categoryName][index + 1];
                            }
                        }

                    }.bind(this));
                },
                configurable: true,
                enumerable: true
            },

            trigger: {
                value: function (eventName, data) {

                    //split the name of the the event
                    var categoryName = eventName.substring(0, eventName.indexOf(':'));

                    // If the topic doesn't exist, or there's no listeners in queue, just leave
                    if (!this.events.hasOwnProperty.call(this.events, categoryName)) return;

                    //trigger the events from the specific name
                    this.events[categoryName].map(function (event) {
                        if (typeof event == 'function') {
                            event(data)();
                        }
                    });

                },
                configurable: true,
                enumerable: true
            }
        });
    };


    /*===========================================CHALLENGE 1 PART 2 ===================================================*/
    var MyEventManager = EventManager();

    var Person = function (name) {
        this.name = name;
        this.eventManager = MyEventManager;
        this.foods = [];

    };

    Person.prototype.waitToEat = function () {
        this.eventManager.on('breakfast:ready', this.eat, this);
    };

    Person.prototype.eat = function (foods) {
        console.log("i'm", this.name, "and i'm eating", foods.join(","));
        this.foods.length = 0;
        this.foods = foods;
        this.eventManager.trigger('eat:done', this);
    };

    Person.prototype.finishEat = function (time) {
        console.log("i'm", this.name, "and i finished eating at", time);
        this.eventManager.off("breakfast:ready", this.finishEat);
    };




    /*=====================================================CHALLENGE 2================================================*/
    //THE ERROR OCCURS BECAUSE THE THIS IS INSIDE OTHER LEXICAL ENVIRONMENT SO IT RECOGNISE THE FOOT AS HIS OBJECT;
    //1 way is to create new variable and save the 'this' pointer in other variable and then pass it inside; (var that = this)
    //2 way is to bind the callback to the outer this for a reference

    Person.prototype.logFood = function () {
        // var that = this;
        this.foods.forEach(function (item) {
            console.log("I'm " + this.name + "and I ate " + item);
        }.bind(this));

    };


    MyEventManager.on('eat:done', function (person) {

        console.log(person.name, "finished eating");

    });


    MyEventManager.on('breakfast:ready', function (menu) {

        console.log("breakfast is ready with:", menu);

    });

    var john = new Person('john', MyEventManager);

    john.waitToEat();

    MyEventManager.on('eat:done', function (person) {

        person.finishEat(new Date());

    });

    var breakfast = ["scrambled eggs", "tomatoes", "bread", "butter"];

    MyEventManager.trigger('breakfast:ready', breakfast);


    john.logFood();

})();