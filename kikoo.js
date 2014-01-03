/**
 * Kikoo
 *
 * https://github.com/JWhile/Kikoo
 *
 * kikoo.js
 */

// class Kikoo
function Kikoo()
{
    this.scroll = new Builder('div')
        .className('scroll')
        .insert(document.body);

    this.apps = [
        new MainApp(this).insert(this.scroll),
        new CookieApp(this).insert(this.scroll)
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
function MainApp(main)
{
    this.super(main, 'main');

    var self = this;

    this.content
        .append(new Builder('p')
            .html('<b>Bienvenue kikoo !</b><br /><i>Choisi une application</i>'))
        .append(new Builder('p')
            .append(new Builder('a')
                .text('Cookie')
                .event('click', function()
                {
                    self.main.move(1);
                })));
}
fus.extend(MainApp, App);

// main
var kikoo = new Kikoo();
