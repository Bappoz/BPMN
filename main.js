import { EventEmitter } from 'node:events';
import { Engine } from 'bpmn-engine';
import  fs from 'node:fs';

const source = fs.readFileSync('./processos/processo-mei.bpmn', 'utf8');

const engine = new Engine({
  name: 'processo-mei',
  source,
  variables: {
    podeSerMEI: false,
      }
})

const listener = new EventEmitter();

listener.on('flow.take', (flow) => {
  console.log(`flow <${flow.id}> was taken`);
});

engine.execute(
  {
    listener,
  },
  (err) => {
    if (err) throw err;
  }
);