'use strict';

// All of these keys are valid working keys registered to
// "Hogwarts Test Application" at http://local.ldsconnect.org,
// which points to 127.0.0.1 for your testing pleasure.
//
// NOTE: grunt automatically serves pages from localhost:9003 which WILL NOT WORK
//
// YOU MUST point your browser to local.ldsconnect.org:9003 or YOU WILL HATE YOUR LIFE
// and spend hours debugging a problem that doesn't exist
// (I've cumulatively wasted nearly a full day of my life on such imagined problems)
//
// TODO need a req.href() or something
/*
    var host = (req.headers.host||'').replace(/^www\./, '')
      , hostname = host.split(':')[0]
      , protocol = 'http' + (req.connection.encrypted ? 's' : '') + '://'
      , href = protocol + host + req.url
*/
module.exports = {
  protocol: 'https'
, hostname: 'aj.the.dj'
, port: 443
, get host() {
    if (
        'http' === this.protocol && '80' === this.port.toString()
      ||'https' === this.protocol && '443' === this.port.toString()
    ) {
      return this.hostname;
    }

    return this.hostname + ':' + this.port;
  }
, get href() {
    return this.protocol + '://' + this.host;
  }
, wsport: 9342
  // the default secret is 'super secret',
  // run `node ./generate-root-secret` to create a new one
, rootUser: {
    id: 'root'
  , salt: "UdVsog0lLYCV1x2mMAGZa6x+7W41xqtTyR4PLZpE8Pc="
  , secret: "7e0e7d6fbb948279f204a8a85f1bee10"
  , type: "md5"
  }
, webhooks: {
    voice: {
      // You'll have to experiment to get these to sound right
      // TODO allow mp3 location for message
      speakablePhone: '5 55, 2 34, 01 23' // 555-234-0123
    , speakableBusiness: 'Ackmee Corp' // ACME Corp
    }
  , text: {
      smsdomain: 'the.dj' // i.e. 555-234-0123@sms.local.ldsconnect.org
    }
  }
, webhookPrefix: '/webhooks'
, oauthPrefix: '/oauth'
, sessionPrefix: '/session'
, apiPrefix: '/api'
, superUserApi: '/api/superuser'
, adminApi: '/api/admin'
, userApi: '/api/user'
, publicApi: '/api/public'
, sessionSecret: 'nothing better than a super secret for aj the dj'
, mailer: {
    service: 'mailgun'
  , defaults: {
      from: 'AJ <aj@the.dj>'
    , replyTo: 'AJ <aj@the.dj>'
    , system: 'Woof <woof@the.dj>'
    , forwardEmailTo: 'AJ the DJ <aj@coolajthedj.com>'
    , forwardTo: 'AJ the DJ <aj@the.dj>'
    }
  , apiKey: 'key-6q321o87kj4bwlp0em997r9ddr6y-uw3'
  , apiPublicKey: 'pubkey-37kqj40ofrzr5f7o-rxy9n0pv6l7kl35'
  , emaildomain: 'the.dj'
  , opts: {
      auth: {
        user: 'postmaster@the.dj'
      , pass: '6lpzks37dno8'
      }
    }
  }
, twilio: {
    id: 'AC08e198a865cfa0bada6c2b7d5b41b02a'
  , auth: '2e04fe941270cb97c7cea94ad5728128'
  , number: '(385) 722-5050'
  , forwardIncomingCallsTo: '(801) 360-4427'
  //, voicemailWav: '/media/voicemail.wav' // from web root
  , get voicemailWav() {
      return this.href + '/media/voicemail.wav'; // from web root
    }
  }
, google: {
    gcm: {
      projectId: 'industrial-net-625'
    , projectNumber: '876156422908'
    //, authorizedIps: ['0.0.0.0/0']
    , publicApiServerKey: 'AIzaSyAwimo0tHDwkqdjtCtovBHS8jJHY0ZPT-8'
    //, authorizedJavaScriptOrigins: ['http://local.ldsconnect.org']
        // defaults to /oauth2callback
    //, authorizedRedirectUri: 'http://local.ldsconnect.org/oauth/google/callback'
    }
  , oauth: {
      id: '876156422908-ia6r6rs3hrttp70hl7gp1k4kuln0i8b4.apps.googleusercontent.com'
    , email: '876156422908-ia6r6rs3hrttp70hl7gp1k4kuln0i8b4@developer.gserviceaccount.com'
    , secret: 'e5FoXbYdTx51rHVdm1gJOg38'
    }
  }
, facebook: {
    // https://developers.facebook.com/apps
    // Client Token 5308ba111a46159e92d74fce76dbe807
    // Test User Email: hogwarts_ogszoxx_user@tfbnw.net
    // Test User Password: secret
    // Test User ID: 100007933814002
    id: '259725070873272'
  , secret: 'd8469a2af25d6b806014be4be272b909'
  }
, twitter: {
    // https://dev.twitter.com/apps
    // default callback /authn/twitter/callback
    consumerKey: 'eLWtqMMGZr1CQC6Wk3tO7g'
  , consumerSecret: 'auhIHIbopDBmXuQizGEINLlGePdqDEd5QgDzvG4CCik'
  }
, ldsconnect: {
    // http://ldsconnect.org
    // Test User Name: dumbledore
    // Test User Password: secret
    id: '55c7-test-bd03'
  , secret: '6b2fc4f5-test-8126-64e0-b9aa0ce9a50d'
  }
, stripe: {
    // https://manage.stripe.com/account/apikeys
    id: "pk_test_526DRmZwEOiMxTigV5fX52ti"
  , secret: "sk_test_Erl9x9947vVPaYigTyKKuXZl"
  }
, tumblr: {
    // https://www.tumblr.com/settings/apps
    // http://www.tumblr.com/oauth/apps
    // default callback /auth/tumblr/callback
    consumerKey: 'b0ix4BsnbExgzi8zf0mmowj8k9g36YqwP5uBUOLoyxYoqBTlD8'
  , consumerSecret: 'FhnXG8TPhQ3xl4xTtfDaCsgAOHHsg7QHUQzmqPmeMcrSjS4CQU'
  }
};
