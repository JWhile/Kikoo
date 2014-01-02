/**
 * Kikoo
 *
 * https://github.com/JWhile/Kikoo
 *
 * kikoo.js
 */

// class KikooApp
function KikooApp()
{
    this.ui = new KikooUI(this); // :KikooUI

    this.url = null; // :Url

    this.cookieId = 0;

    this.cookies = []; // :Array<Cookie>
}
// function update():void
KikooApp.prototype.update = function()
{
    this.ui.setCookies(this.cookies);
};
// function setCookie(Object details):void
KikooApp.prototype.setCookie = function(details)
{
    chrome.cookies.set(details, function(cookie)
    {
        if(cookie == null)
        {
            console.log(chrome.runtime.lastError);
        }

        this.load();
    })
};
// function delCookie(Cookie cookie, function callback = null):void
KikooApp.prototype.delCookie = function(cookie, callback)
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
KikooApp.prototype.load = function()
{
    this.ui.insert(document.body);

    var self = this;

    chrome.tabs.query({'highlighted': true, 'currentWindow': true}, function(tabs)
    {
        self.url = new Url(tabs[0].url).parse();

        chrome.cookies.getAll({'domain': self.url.domain}, function(cookies)
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

// class KikooUI extends Builder
function KikooUI(app)
{
    this.super('div');

    this.app = app;

    var self = this;

    new Builder('div')
        .attr('id', 'head')
        .append(new Builder('p')
            .attr('id', 'logo')
            .html('<b>Kikoo</b>! <span>Cookie</span>'))
        .append(new Builder('div')
            .attr('id', 'plus')
            .text('+')
            .append(new Builder('a')
                .text('Ajouter')
                .event('click', function()
                {
                    self.form.setCookie({});
                }))
            .append(new Builder('a')
                .text('Actualiser')
                .event('click', function()
                {
                    self.app.load();
                })))
        .insert(this);

    this.form = new KikooForm(this.app)
        .insert(this);

    this.content = new Builder('div')
        .attr('id', 'content')
        .html('<i>Chargement...</i>')
        .insert(this);

    new Builder('div')
        .attr('id', 'foot')
        .html('By <a href="https://github.com/JWhile">juloo</a>')
        .insert(this);
}
fus.extend(KikooUI, Builder);
// function setCookies(Array<Cookie> cookies):void
KikooUI.prototype.setCookies = function(cookies)
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

// class KikooForm extends Builder
function KikooForm(app)
{
    this.super('div');

    this.app = app;

    this.cookie = null;

    this.name = new Builder('input').attr('type', 'text');
    this.domain = new Builder('input').attr('type', 'text');
    this.path = new Builder('input').attr('type', 'text');
    this.secure = new Builder('input').attr('type', 'checkbox');
    this.httpOnly = new Builder('input').attr('type', 'checkbox');
    this.expirationDate = new Builder('input').attr('type', 'date');
    this.value = new Builder('input').attr('type', 'text');

    var self = this;

    this.attr('id', 'form')
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
            }));
}
// function setCookie(Object|chrome.Cookie cookie)
KikooForm.prototype.setCookie = function(cookie)
{
    this.cookie = cookie;

    this.name.attr('value', cookie.name || '');
    this.domain.attr('value', cookie.domain || this.app.url.domain);
    this.path.attr('value', cookie.path || '/');
    this.secure.attr('checked', !!cookie.secure);
    this.httpOnly.attr('checked', !!cookie.httpOnly);
    this.expirationDate.attr('value', cookie.expirationDate || new Date());
    this.value.attr('value', cookie.value || '');

    this.css('display', 'block');
};
// function submit():void
KikooForm.prototype.submit = function()
{
    var self = this;

    this.app.delCookie(this.cookie, function()
    {
        self.app.setCookie({
            'url': self.app.url.url,
            'name': self.name.node.value,
            'domain': self.domain.node.value,
            'path': self.path.node.value,
            'secure': self.secure.node.checked,
            'httpOnly': self.httpOnly.node.checked,
            'expirationDate': self.name.node.value,
            'value': self.name.node.value
        });
    });

    this.cancel();
};
// function cancel():void
KikooForm.prototype.cancel = function()
{
    this.cookie = null;

    this.css('display', 'none');
};
fus.extend(KikooForm, Builder);

// class Cookie extends Builder
function Cookie(id, cookie, app)
{
    var self = this;

    this.super('div');

    this.app = app;

    this.id = id;
    this.cookie = cookie;

    this.open = false;

    this.className('cookie')
        .append(new Builder('div')
            .className('cookie-head')
            .text(this.cookie.name)
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
                        self.app.ui.setCookie(self.cookie);
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

/**
 * main
 */
var kikoo = new KikooApp();

kikoo.load();
