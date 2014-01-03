/**
 * Kikoo
 *
 * https://github.com/JWhile/Kikoo
 *
 * kikoo.js
 */

// class CookieApp
function CookieApp()
{
    this.ui = new CookieUI(this); // :CookieUI

    this.url = null; // :Url

    this.cookieId = 0; // :int

    this.cookies = []; // :Array<Cookie>
}
// function update():void
CookieApp.prototype.update = function()
{
    this.ui.setCookies(this.cookies);
};
// function addCookie(Object details):void
CookieApp.prototype.addCookie = function(details)
{
    var self = this;

    chrome.cookies.set(details, function(cookie)
    {
        if(cookie == null)
        {
            console.log(chrome.runtime.lastError);
        }

        self.load();
    })
};
// function delCookie(Cookie cookie, function callback = null):void
CookieApp.prototype.delCookie = function(cookie, callback)
{
    var self = this;

    cookie.css('border-color', '');

    chrome.cookies.remove({'url': self.url.url, 'name': cookie.cookie.name}, function(details)
    {
        if(details == null)
        {
            cookie.css('border-color', '#c10');

            console.log(chrome.runtime.lastError);
        }
        else
        {
            cookie.remove();

            for(var i = 0; i < self.cookies.length; ++i)
            {
                if(self.cookies[i].id === cookie.id)
                {
                    self.cookies.splice(i, 1);
                    break;
                }
            }

            if(!callback)
            {
                self.update();
            }
        }

        if(callback)
        {
            callback();
        }
    });
};
// function load():void
CookieApp.prototype.load = function()
{
    this.ui.insert(document.body);

    var self = this;

    chrome.tabs.query({'highlighted': true, 'currentWindow': true}, function(tabs)
    {
        self.url = new Url(tabs[0].url).parse();

        chrome.cookies.getAll({'domain': self.url.domain || 'localhost'}, function(cookies)
        {
            self.cookies = [];

            for(var i = 0; i < cookies.length; ++i)
            {
                self.cookies.push(new Cookie(++self.cookieId, cookies[i], self));
            }

            self.update();
        });
    });
};

// class CookieUI extends Builder
function CookieUI(app)
{
    this.super('div');

    this.app = app; // :CookieApp

    var self = this;

    new Builder('div')
        .set('id', 'head')
        .append(new Builder('p')
            .set('id', 'logo')
            .html('<b>Kikoo</b>! <span>Cookie</span>'))
        .append(new Builder('div')
            .set('id', 'plus')
            .text('+')
            .append(new Builder('a')
                .text('Ajouter')
                .event('click', function()
                {
                    self.form.setCookie(null);
                }))
            .append(new Builder('a')
                .text('Actualiser')
                .event('click', function()
                {
                    self.app.load();
                })))
        .insert(this);

    this.form = new CookieForm(this.app)
        .insert(this);

    this.content = new Builder('div')
        .set('id', 'content')
        .html('<i>Chargement...</i>')
        .insert(this);

    new Builder('div')
        .set('id', 'foot')
        .html('By <a href="https://github.com/JWhile">juloo</a>')
        .insert(this);
}
fus.extend(CookieUI, Builder);
// function setCookies(Array<Cookie> cookies):void
CookieUI.prototype.setCookies = function(cookies)
{
    this.content.clear();

    if(cookies.length === 0)
    {
        this.content.text('Aucun cookie pour ce site.');
    }
    else
    {
        for(var i = 0; i < cookies.length; ++i)
        {
            this.content.append(cookies[i]);
        }
    }
};

// class CookieForm extends Builder
function CookieForm(app)
{
    this.super('div');

    this.app = app;

    this.cookie = null;

    this.name = new Builder('input')
        .set('type', 'text');
    this.domain = new Builder('input')
        .set('type', 'text');
    this.path = new Builder('input')
        .set('type', 'text');
    this.secure = new Builder('input')
        .set('type', 'checkbox');
    this.httpOnly = new Builder('input')
        .set('type', 'checkbox');
    this.expirationDate = new Builder('input')
        .set('type', 'datetime-local');
    this.value = new Builder('input')
        .className('input-value')
        .set('type', 'text');

    var self = this;

    this.set('id', 'form')
        .append(new Builder('div')
            .append(new Builder('label')
                .text('Nom'))
            .append(this.name))
        .append(new Builder('div')
            .append(new Builder('label')
                .text('Domaine'))
            .append(this.domain))
        .append(new Builder('div')
            .append(new Builder('label')
                .text('Chemin'))
            .append(this.path))
        .append(new Builder('div')
            .append(new Builder('label')
                .text('Secure'))
            .append(this.secure))
        .append(new Builder('div')
            .append(new Builder('label')
                .text('HttpOnly'))
            .append(this.httpOnly))
        .append(new Builder('div')
            .append(new Builder('label')
                .text('Expiration'))
            .append(this.expirationDate))
        .append(new Builder('div')
            .append(new Builder('label')
                .text('Valeur'))
            .append(this.value))
        .append(new Builder('div')
            .className('form-menu')
            .append(new Builder('a')
                .text('Valider')
                .event('click', function()
                {
                    self.submit();
                }))
            .append(new Builder('a')
                .text('Annuler')
                .event('click', function()
                {
                    self.cancel();
                })));
}
// function setCookie(Object|chrome.Cookie cookie)
CookieForm.prototype.setCookie = function(cookie)
{
    this.cookie = cookie;

    cookie = cookie? cookie.cookie || {} : {};

    this.name.set('value', cookie.name || '');
    this.domain.set('value', cookie.domain || this.app.url.domain || 'localhost');
    this.path.set('value', cookie.path || '/');
    this.secure.set('checked', !!cookie.secure);
    this.httpOnly.set('checked', !!cookie.httpOnly);

    var d = (cookie.expirationDate? new Date(cookie.expirationDate * 1000) : new Date(Date.now() + 3600000));

    var z = function(num)
    {
        return (num < 10)? '0'+ num : num;
    };

    this.expirationDate.set('value', d.getFullYear() +'-'+ z(d.getMonth() + 1) +'-'+ z(d.getDate()) +'T'+ z(d.getHours()) +':'+ z(d.getMinutes()) +':'+ z(d.getSeconds()));
    this.value.set('value', cookie.value || '');

    this.css('display', 'block');
};
// function submit():void
CookieForm.prototype.submit = function()
{
    var self = this;

    var callback = function()
    {
        var details = {
            'url': self.app.url.url,
            'name': self.name.node.value,
            'domain': self.domain.node.value,
            'path': self.path.node.value,
            'secure': self.secure.node.checked,
            'httpOnly': self.httpOnly.node.checked,
            'value': self.value.node.value
        };

        if(self.expirationDate.node.value)
        {
            var date = (new Date(self.expirationDate.node.value)).getTime();

            if(date > Date.now())
            {
                details['expirationDate'] = date / 1000;
            }
        }

        self.app.addCookie(details);
    };

    if(this.cookie != null)
    {
        this.app.delCookie(this.cookie, callback);
    }
    else
    {
        callback();
    }

    this.cancel();
};
// function cancel():void
CookieForm.prototype.cancel = function()
{
    this.cookie = null;

    this.css('display', 'none');
};
fus.extend(CookieForm, Builder);

// class Cookie extends Builder
function Cookie(id, cookie, app)
{
    var self = this;

    this.super('div');

    this.app = app; // :CookieApp

    this.id = id; // :int
    this.cookie = cookie; // :chrome.Cookie

    this.open = false; // :boolean

    this.className('cookie')
        .append(new Builder('div')
            .className('cookie-head')
            .html(this.cookie.name || '<i>Sans nom</i>')
            .event('click', function()
            {
                self.open = !self.open;

                self.className(self.open? 'cookie-open' : 'cookie');
            }))
        .append(new Builder('div')
            .className('cookie-content')
            .append(new Builder('div')
                .className('cookie-menu')
                .append(new Builder('a')
                    .text('modifier')
                    .event('click', function()
                    {
                        self.app.ui.form.setCookie(self);
                    }))
                .append(new Builder('a')
                    .text('supprimer')
                    .event('click', function()
                    {
                        self.app.delCookie(self);
                    })))
            .append(new Builder('div')
                .className('cookie-p')
                .text(this.cookie.domain + this.cookie.path +'\n'+ ((this.cookie.session)? 'Cookie de session' : new Date(this.cookie.expirationDate * 1000).toString())))
            .append(new Builder('div')
                .className('cookie-info')
                .text('Secure\n'+ this.cookie.secure))
            .append(new Builder('div')
                .className('cookie-info')
                .text('HostOnly\n'+ this.cookie.hostOnly))
            .append(new Builder('div')
                .className('cookie-info')
                .text('HttpOnly\n'+ this.cookie.httpOnly))
            .append(new Builder('div')
                .className('cookie-p cookie-value')
                .text(this.cookie.value)));
}
fus.extend(Cookie, Builder);
