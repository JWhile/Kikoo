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
    this.ui = new KikooUI(); // :KikooUI

    this.url = null; // :Url

    this.cookieId = 0;

    this.cookies = []; // :Array<Cookie>
}
// function update():void
KikooApp.prototype.update = function()
{
    this.ui.setCookies(this.cookies);
};
// function addCookie(chrome.Cookie cookie):void
KikooApp.prototype.addCookie = function(cookie)
{
    this.cookies.push(new Cookie(++this.cookieId, cookies[i], this));

    this.update();
};
// function delCookie(Cookie cookie):void
KikooApp.prototype.delCookie = function(cookie)
{
    var self = this;

    cookie.css('border-color', '');

    setTimeout(function()
    {
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
            }
        });
    }, 450);
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
            for(var i = 0; i < cookies.length; ++i)
            {
                self.cookies.push(new Cookie(++self.cookieId, cookies[i], self));
            }

            self.update();
        });
    });
};

// class KikooUI extends Builder
function KikooUI()
{
    this.super('div');

    new Builder('div')
        .attr('id', 'head')
        .append(new Builder('p')
            .attr('id', 'logo')
            .html('<b>Kikoo</b>! <span>Cookie</span>'))
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
        this.content.html('Aucun cookie pour ce site.');
    }
    else
    {
        for(var i = 0; i < cookies.length; ++i)
        {
            this.content.append(cookies[i]);
        }
    }
};

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
            .text(self.cookie.name)
            .event('click', function()
            {
                self.open = !self.open;

                self.className(self.open? 'cookie-open' : 'cookie');
            }))
        .append(new Builder('div')
            .className('cookie-content')
            .append(new Builder('a')
                .text('modifier')
                .event('click', function()
                {
                    // Modifier
                }))
            .append(new Builder('a')
                .className('right')
                .text('supprimer')
                .event('click', function()
                {
                    self.app.delCookie(self);
                })));

}
fus.extend(Cookie, Builder);

/**
 * main
 */
var kikoo = new KikooApp();

kikoo.load();
