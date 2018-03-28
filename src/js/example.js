import Fun from './virtual-dom';

const myBtn = new Fun('button', { id: 'myBtn' }, ['我是创建出来的dom']);
document.body.append(myBtn.render());

console.log(myBtn);