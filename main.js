/**
 * Kikoo
 *
 * main.js
 */

// class Kikoo
function Kikoo()
{
    this.main = new MainApp().insert(document.body);
    this.cookie = new CookieApp().insert(document.body);
}

// class MainApp extends Builder
function MainApp()
{
    this.super('div');

    this.set('id', 'main')
        .className('app');

    new Builder('div')
        .className('head')
        .append(new Builder('p')
            .className('logo')
            .html('<b>Kikoo</b>! <span>...</span>'))
        .insert(this);

    this.content = new Builder('div')
        .className('content')
        .append(new Builder('a')
            )
        .insert(this);

    new Builder('div')
        .className('foot')
        .html('By <a href="https://github.com/JWhile">juloo</a>')
        .insert(this);
}
fus.extend(MainApp, Builder);

var kikoo = new Kikoo();
