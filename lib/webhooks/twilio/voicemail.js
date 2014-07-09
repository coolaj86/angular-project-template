"use strict";

module.exports.create = function (opts) {
  var voicemail = {}
    , Twilio = require('twilio')
    , forEachAsync = require('foreachasync').forEachAsync
    , config
    , twilio
    ;

  config = opts;
  twilio = new Twilio.RestClient(config.id, config.auth);

  function forwardTranscriptViaEmail(caller, text, body) {
    var subject
      , msg
      ;

    // same subject for both emails
    subject = "Voicemail from " + caller ;
    msg = ""
      + (text || 'failed to transcribe') + "\n\n"
      + "\nFrom " + caller + "\n\n"
      + "\n\n\n\n"
      + body
      ;

    opts.api.mailIn(caller, subject, msg);
  }
  function forwardVoicemailViaEmail(caller, mp3, body) {
    var subject
      , msg
      ;

    // same subject for both emails
    subject = "Voicemail from " + caller ;
    msg = ""
      + "\n" + caller + "\n\n"
      + mp3 + "\n\n"
      + "\n\n\n\n"
      + body
      ;

    opts.api.mailIn(caller, subject, msg);
  }

  // Carriers will chunk out SMS from the phone,
  // but when sending it manually, we must chunk it out ourselves
  function forwardTranscriptViaSms(caller, text) {
    var obj
      , body = ("Transcript for " + caller + " " + (text ? (" " + text) : "")).split('')
      , bodies = []
      ;

    function sendSms(obj, next) {
      twilio.sendSms(
        obj
      , function(error, message) {
          if (!error) {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);

            console.log('Message sent on:');
            console.log(message.dateCreated);
            next();
          }
          else {
            console.log('Oops! There was an error.');
            console.error(error);
          }
        }
      );
    }

    // TODO try to split on a word boundary
    while (body.length) {
      // "(xx/yy)".length //6
      bodies.push(body.splice(0, 152).join(''));
    }

    forEachAsync(bodies, function (next, body, i) {
      obj = {
        to: config.forwardIncomingCallsTo
      , from: config.number
      , body: "(" + (i + 1) + "/" + bodies.length + ")" + body
      };
      sendSms(obj, next);
    });
  }

  function forwardVoicemailViaSms(caller, mp3) {
    var obj
        //                       15 +   12   +  1  + 122 = 150
      , body = "Voicemail from " + caller + " " + mp3
      ;

    obj = {
        to: config.forwardIncomingCallsTo
      , from: config.number
      , body: body
      };

    twilio.sendSms(
      obj
    , function(error, message) {
        if (!error) {
          console.log('Success! The SID for this SMS message is:');
          console.log(message.sid);

          console.log('Message sent on:');
          console.log(message.dateCreated);
        }
        else {
          console.log('Oops! There was an error.');
          console.error(error);
        }
      }
    );
  }

  // Accept a voicemail and record the message
  voicemail.create = function (req, res) {
    var resp = new Twilio.TwimlResponse()
      ;

    console.log('[VOICEMAIL]');
    if (req.call) {
      req.call.hasVoicemail = true;
    }

    resp.play(opts.voicemailWav);
    resp.record({
      action: opts.webhookPrefix + '/voicemail/forward?wait=true'
    , transcribeCallback: opts.webhookPrefix + '/voicemail/forward'
    , maxLength: 150
    , transcribe: true
      // TODO remove beep from my recording
    , playBeep: false
      // end recording if the person doesn't speak within 5 seconds
    , timeout: 5
    , method: 'POST'
    });

    // Actually respond
    res.xend(resp.toString());
  };

  voicemail.forward = function (req, res) {
    var resp = new Twilio.TwimlResponse()
      ;

    if (req.call) {
      req.call.hasVoicemail = true;
    }

    // Both of these methods are simply best-effort (and no callback).
    // TODO Could store them in a database and retry or something, but keeping it simple for now
    // RecordingUrl: 'http://api.twilio.com/2010-04-01/Accounts/AC08e198a865cfa0bada6c2b7d5b41b02a/Recordings/REbd0c0c8a0c552687959102baac212933'

    // Don't do anything until the transcription is complete
    if (req.query.wait) {
      // Recording only
      forwardVoicemailViaSms(
        req.body.Caller
      , req.body.RecordingUrl
      );
      forwardVoicemailViaEmail(
        req.body.Caller
      , req.body.RecordingUrl
      , JSON.stringify(req.body, null, '  ')
      );
    } else {
      // Transcript only
      forwardTranscriptViaSms(
        req.body.Caller
      , req.body.TranscriptionText
      );
      forwardTranscriptViaEmail(
        req.body.Caller
      , req.body.TranscriptionText
      , JSON.stringify(req.body, null, '  ')
      );
    }

    res.xend(resp.toString());
  };

  return voicemail;
};
