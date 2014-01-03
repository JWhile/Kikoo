/**
 * Kikoo
 *
 * main.js
 */

// class Kikoo
function Kikoo()
{
    this.main = new MainApp();
    this.cookie = new CookieApp();
}

// class MainApp extends Builder
function MainApp()
{
    this.super('div');

    this.set('id', 'main')
        .className('app');
}
fus.extend(MainApp, Builder);

var kikoo = new Kikoo();

kikoo.load();