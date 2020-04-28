import { produce } from 'immer';

const proversion = () => {
  const converters = {};
  return {
    add: (to, converter) => {
      converters[to] = produce((draft) => {
        draft.version = to;
        converter(draft);
      });
    },
    upgrade: (subject) => {
      const { version = 1 } = subject;
      const convertersToRun = Object.keys(converters)
        .map(Number)
        .sort()
        .filter((x) => x > version);
      return convertersToRun.reduce(
        (current, to) => {
          return {
            applied: current.applied.concat([to]),
            result: converters[to](current.result),
          };
        },
        { applied: [], result: subject }
      );
    },
  };
};

export default proversion;
