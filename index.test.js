import proversion from './index';

describe('proversion', () => {
  it('has interface', () => {
    const result = proversion();
    expect(result).toHaveProperty('addConverter');
    expect(result).toHaveProperty('upgrade');
  });

  it('upgrades to the next version', () => {
    const surveys = proversion();
    surveys.addConverter(2, (draft) => {
      draft.myAddedParam = true;
    });

    const original = { version: 1 };
    const { applied, result } = surveys.upgrade(original);

    // Will have applied a single upgrade to version 2
    expect(applied).toEqual([2]);

    // original will be upgraded to version 2
    expect(result.version).toEqual(2);
    expect(result).toHaveProperty('myAddedParam');
    expect(result.myAddedParam).toBeTrue();
  });

  it('upgrades multiple versions', () => {
    const surveys = proversion();
    surveys.addConverter(2, (draft) => {
      draft.myAddedParam = true;
    });
    surveys.addConverter(3, (draft) => {
      draft.myAddedParam = false;
      draft.hi = 'There';
    });

    const original = { version: 1 };
    const { applied, result } = surveys.upgrade(original);

    // Will have applied two upgrades to version 3
    expect(applied).toEqual([2, 3]);

    // original will be upgraded to version 3
    expect(result.version).toEqual(3);
    expect(result).toHaveProperty('myAddedParam');
    expect(result.myAddedParam).toBeFalse();
    expect(result).toHaveProperty('hi');
    expect(result.hi).toEqual('There');
  });

  it('upgrades from specific version', () => {
    const surveys = proversion();
    surveys.addConverter(2, (draft) => {
      draft.myAddedParam = true;
    });
    surveys.addConverter(3, (draft) => {
      draft.myAddedParam = false;
      draft.hi = 'There';
    });
    surveys.addConverter(4, (draft) => {
      draft.hi = 'Not today';
    });
    surveys.addConverter(5, (draft) => {
      draft.hi = draft.hi.toLowerCase();
    });
    surveys.addConverter(6, (draft) => {
      draft.hi = draft.hi.replace(/ /g, '_');
    });

    const original = { version: 3, myAddedParam: false, hi: 'There' };
    const { applied, result } = surveys.upgrade(original);

    // Will have applied three upgrades to version 6
    expect(applied).toEqual([4, 5, 6]);

    // original will be upgraded to version 6
    expect(result.version).toEqual(6);
    expect(result.hi).toEqual('not_today');
  });
});
