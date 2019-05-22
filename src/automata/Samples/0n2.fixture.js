export default {
  initial: 'new58',
  final: `["new63"]`,
  states: `[{"data":{"id":"new58","label":"q1"},"position":{"x":127.67500000000007,"y":229},"classes":"dfa__state dfa__state--initial"},{"data":{"id":"new36","label":"q2"},"position":{"x":235.4375,"y":171},"classes":"dfa__state"},{"data":{"id":"new13","label":"q3"},"position":{"x":516.4096144329416,"y":171.96563697820625},"classes":"dfa__state"},{"data":{"id":"new78","label":"q5"},"position":{"x":350.4128982470203,"y":94.20993578483262},"classes":"dfa__state"},{"data":{"id":"new18","label":"q4"},"position":{"x":441.30149797976117,"y":331.4909346346748},"classes":"dfa__state"},{"data":{"id":"new63","label":"qacc"},"position":{"x":255.02499999999986,"y":334},"classes":"dfa__state dfa__state--final"}]`,
  transitions: `[["b404f265-422f-4db7-a0c9-d471879eabaa",{"id":"b404f265-422f-4db7-a0c9-d471879eabaa","source":"new58","target":"new36","left":"0","label":"${String.fromCharCode(
    0x2423
  )}","right":"R"}],["07ade13b-880a-4ab7-a342-a5c3242f8082",{"id":"07ade13b-880a-4ab7-a342-a5c3242f8082","source":"new13","target":"new13","left":"x","label":"x","right":"R"}],["6d6430b2-62f3-4df7-8676-79ac0acf8fcb",{"id":"6d6430b2-62f3-4df7-8676-79ac0acf8fcb","source":"new36","target":"new13","left":"0","label":"x","right":"R"}],["35862f3c-965f-44af-93d1-2132ebca76a3",{"id":"35862f3c-965f-44af-93d1-2132ebca76a3","source":"new13","target":"new78","left":"${String.fromCharCode(
    0x2423
  )}","label":"${String.fromCharCode(
    0x2423
  )}","right":"L"}],["845d130e-a98c-4c20-a981-621e965cf80a",{"id":"845d130e-a98c-4c20-a981-621e965cf80a","source":"new78","target":"new36","left":"${String.fromCharCode(
    0x2423
  )}","label":"${String.fromCharCode(
    0x2423
  )}","right":"R"}],["d62e354d-cfe7-4635-b7ae-c51fa58adc13",{"id":"d62e354d-cfe7-4635-b7ae-c51fa58adc13","source":"new78","target":"new78","left":"0","label":"0","right":"L"}],["0fb5d44f-ce7f-4e5e-855c-cf579dac6a78",{"id":"0fb5d44f-ce7f-4e5e-855c-cf579dac6a78","source":"new18","target":"new13","left":"0","label":"x","right":"R"}],["f1dd9596-0949-444b-a24a-4c9bca5a9837",{"id":"f1dd9596-0949-444b-a24a-4c9bca5a9837","source":"new13","target":"new18","left":"0","label":"0","right":"R"}],["8240d7f2-b62b-480f-92f2-df9fcba7f0ab",{"id":"8240d7f2-b62b-480f-92f2-df9fcba7f0ab","source":"new36","target":"new63","left":"${String.fromCharCode(
    0x2423
  )}","label":"${String.fromCharCode(
    0x2423
  )}","right":"R"}],["9ceb54ef-05e6-4cdb-8da9-aaeab7b88c43",{"id":"9ceb54ef-05e6-4cdb-8da9-aaeab7b88c43","source":"new36","target":"new36","left":"x","label":"x","right":"R"}],["e590e0f4-654a-4d1a-890e-4fa0b3e8d52d",{"id":"e590e0f4-654a-4d1a-890e-4fa0b3e8d52d","source":"new18","target":"new18","left":"x","label":"x","right":"R"}],["1b6a77cc-b2be-4a45-b9ef-784762ea684f",{"id":"1b6a77cc-b2be-4a45-b9ef-784762ea684f","label":"x","left":"x","right":"L","source":"new78","target":"new78"}]]`,
  multipleInput: `["0","00","0000","00000"]`
}
