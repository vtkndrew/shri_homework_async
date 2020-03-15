Promise._any = (promises) => {
  return new Promise((resolve, reject) => {
    let done = 0;
    for (let promise of promises) {
      Promise.resolve(promise).then(value => {
        done++;
        resolve(value);
      }, () => {
        done++;

        if (done === promises.length) {
          const error = new Error('Все промисы выполнились с ошибкой');
          reject(error);
        }
      });
    }
  });
};

async function PromiseAnyTests() {
  let test, should, value;

  test = 1;
  should = 3;
  value = await Promise._any([
    new Promise((res, rej) => { setTimeout(() => { rej(1) }, 500) }),
    new Promise((res, rej) => { setTimeout(() => { rej(2) }, 1000) }),
    new Promise((res, rej) => { setTimeout(() => { res(3) }, 1500) })
  ]);
  console.log(`Promise._any. test${test} correct: ${should === value}`);

  test = 2;
  Promise._any([
    new Promise((res, rej) => { setTimeout(() => { rej(1) }, 500) }),
    new Promise((res, rej) => { setTimeout(() => { rej(2) }, 1000) }),
    new Promise((res, rej) => { setTimeout(() => { rej(3) }, 1500) })
  ])
    .then(value => {
      console.log(`Promise._any. test${test} correct: ${value instanceof Error}`);
    })
    .catch(value => {
      console.log(`Promise._any. test${test} correct: ${value instanceof Error}`);
    });
};

Promise._allSettled = (promises) => {
  const makeObj = (value, isRejected) => {
    const status = isRejected ? 'rejected' : 'fulfilled';
    return {
      status,
      value
    }
  };

  return new Promise(resolve => {
    let done = 0;
    const results = [];
    promises.forEach((promise, id) => {
      Promise.resolve(promise).then(value => {
        done++;

        results[id] = makeObj(value, false);

        if (done === promises.length) {
          resolve(results);
        }
      }, value => {
        done++;

        results[id] = makeObj(value, true);

        if (done === promises.length) {
          resolve(results);
        }
      });
    });
  });
};

async function PromiseAllSettledTests() {
  const value = await Promise._allSettled([
    new Promise((res, rej) => { setTimeout(() => { res(1) }, 500) }),
    new Promise((res, rej) => { setTimeout(() => { rej(2) }, 1000) }),
    new Promise((res, rej) => { setTimeout(() => { res(3) }, 1500) })
  ]);

  console.log('Promise._allSettled test: ', value);
}

// TODO:
Promise.prototype._finally = () => {
  // return Promise.prototype.then(value => {});
};

// TODO:
async function PromiseFinallyTests() {
  console.log('Promise.prototype._finally test');
}

PromiseAnyTests()
  .then(() => {
    return PromiseAllSettledTests();
  })
  .then(() => {
    return PromiseFinallyTests();
  });