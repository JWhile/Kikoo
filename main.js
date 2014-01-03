/**
 * Kikoo
 *
 * main.js
 */

// class Kikoo
function Kikoo()
{
    this.scroll = new Builder('div')
        .className('scroll')
        .insert(document.body);

    this.apps = [
        new MainApp().insert(this.scroll),
        new CookieApp().insert(this.scroll)
    ];

    this.move(0);
}
// function move(int index):void
Kikoo.prototype.move = function(index)
{
    this.apps[index].css('display', '');

    this.scroll.css('left', '-'+ (index * 210) +'px');

    var self = this;

    setTimeout(function()
    {
        for(var i = 0; i < self.apps.length; ++i)
        {
            self.apps[i].css('display', (i === index)? '' : 'none');
        }
    }, 340);
};

// class MainApp extends App
function MainApp(kikoo)
{
    this.super('main');

    this.kikoo = kikoo;

    this.content
        .append(new Builder('p')
            .html('<b>Bienvenue kikoo !</b><br /><i>Choisi une application</i>'))
        .append(new Builder('p')
            .append(new Builder('a')
                .text('Cookie'))
            .add('<br /><i>Modifie tes cookies comme un kikoo !</i>'));
}
fus.extend(MainApp, App);

var kikoo = new Kikoo();
