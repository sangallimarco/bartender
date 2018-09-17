// import { ActionType, createAction, getType } from 'typesafe-actions';

// interface TestPayload {
//     name: string;
// }
// interface SecondPayload {
//     code: number;
// }
// interface ThirdPayload {
//     other: string;
// }

// const RootActions = {
//     TEST: createAction('TEST', resolve => {
//         return (data: TestPayload) => {
//             return resolve(data);
//         };
//     }),
//     SECOND: createAction('SECOND', resolve => {
//         return (data: SecondPayload) => {
//             return resolve(data);
//         };
//     }),
//     THIRD: createAction('THIRD', resolve => {
//         return (data: ThirdPayload) => {
//             return resolve(data);
//         };
//     })
// };
// type RootAction = ActionType<typeof RootActions>;

// function dispatch(data: RootAction) {
//     switch (data.type) {
//         case getType(RootActions.TEST):
//             console.log(data.payload.name);
//             break;
//         case getType(RootActions.SECOND):
//             console.log(data.payload.code);
//             break;
//         case getType(RootActions.THIRD):
//             console.log(data.payload.other);
//             break;
//     }
// }

// const testMessage: Item<TestPayload> = { type: 'test', payload: { name: 'ok' } };
// // const secondMessage: Item<SecondPayload> = { type: 'second', payload: { code: 123123 } };

