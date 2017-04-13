/* Timetable for Paris local transport Module */
/* Magic Mirror
 * Module: MMM-Transilien
 *
 * By Louis-Guillaume MORAND
 * based on a script from Benjamin Angst http://www.beny.ch and Georg Peters (https://lane6.de)
 * MIT Licensed.
 */
const NodeHelper = require("node_helper");
const xml2js  = require("xml2js ");
const forge = require('node-forge');
const unirest = require('unirest');

module.exports = NodeHelper.create({

    updateTimer: "",
    start: function() {
        this.started = false;
        console.log("MMM-Transilien- NodeHelper started");
    },

    /* updateTimetable(transports)
     * Calls processTransports on succesfull response.
     */
    updateTimetable: function() {
        var url = this.config.apiURL;
        var self = this;
        var retry = false;


        // calling this API
        var request = unirest.get(url);
        request.auth({
            user: 'tnhtn613',
            pass: '4i2xsTN7',
            sendImmediately: true
        });
        
        request.end(function(r) {
                if (r.error) {
                    console.log(self.name + " : " + r.error);
                    retry = true;
                } else {
                    self.processTransports(r.body);
                }

                if (retry) {
                    console.log("retrying");
                    self.scheduleUpdate((self.loaded) ? -1 : this.config.retryDelay);
                }
            });
    },
 

    /* processTransports(data)
     * Uses the received data to set the various values.
     */
    processTransports: function(data) {

        this.transports = [];

        // we convert it to json to be easier to parse
        var responseInJson = null;
        xml2js.parseString(data.response, function (err, result) {
                    responseInJson = result;
                });

        this.lineInfo = "Train en gare de XXX"; // je me demande s'il faut pas le mettre dans la configuration ce nom. sinon il faut refaire un appel à l'api pour avoir le "libelle SMS gare"
        
        for (var i = 0, count = responseInJson.trains.length; i < count; i++) {

            var nextTrain = data.response.trains[i];

            this.transports.push({
                name: nextTrain.miss,
                date: nextTrain.date,
                state: nextTrain.date.mode
            });
        }
        this.loaded = true;
        this.sendSocketNotification("TRAINS", {
            transports: this.transports,
            lineInfo: this.lineInfo
        });
    },


    /* scheduleUpdate()
     * Schedule next update.
     * argument delay number - Millis econds before next update. If empty, this.config.updateInterval is used.
     */
    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;

        if (typeof delay !== "undefined" && delay > 0) {
            nextLoad = delay;
        }

        var self = this;
        clearTimeout(this.updateTimer);
        this.updateTimer = setInterval(function() {
            self.updateTimetable();
        }, nextLoad);
    },

    socketNotificationReceived: function(notification, payload) {
        if (payload.debugging) {
            console.log("Notif received: " + notification);
            console.log(payload);
        }

        const self = this;
        if (notification === 'CONFIG' && this.started == false) {
            this.config = payload;
            this.started = true;
            self.scheduleUpdate(this.config.initialLoadDelay);
        }
    }
});