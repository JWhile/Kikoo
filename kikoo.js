/**
 * Kikoo
 *
 * https://github.com/JWhile/Kikoo
 *
 * kikoo.js
 */

function KikooApp()
{
    this.ui = new KikooUI();
}

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
        .insert(this);

    new Builder('div')
        .attr('id', 'foot')
        .html('By <a href="https://github.com/JWhile">juloo</a>')
        .insert(this);
}
fus.extend(KikooUI, Builder);
