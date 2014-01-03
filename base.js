/**
 * Kikoo
 *
 * base.js
 */

// class App extends Builder
function App(name)
{
    this.super('div');

    this.name = name;

    this.set('id', name)
        .className('app');

    this.head = new Builder('div')
        .className('head')
        .append(new Builder('p')
            .className('logo')
            .html('<b>Kikoo</b>! <span>'+ name +'</span>'))
        .insert(this);

    this.content = new Builder('div')
        .className('content')
        .insert(this);

    this.foot = new Builder('div')
        .className('foot')
        .html('By <a href="https://github.com/JWhile">juloo</a>')
        .insert(this);
}
fus.extend(App, Builder);
