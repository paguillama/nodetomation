let stateMap = new WeakMap();

const SECONDS_PER_LETTER = 0.15,
  MIN_SECONDS = 2;

export default class NodetoMessageService {
  
  constructor($timeout) {
    stateMap.set(this, {
      messages: [],
      messageTimings: [],
      $timeout: $timeout
    });
  }

  add (message, options) {
    let state = stateMap.get(this);


    state.messages.push({
      key: options && options.key,
      text: message,
      type: options && options.type,
      permanent: options && options.permanent || false
    });

    if (!options || !options.permanent) {
      var messageMilliseconds = Math.max(MIN_SECONDS * 1000, lengthInUtf8Bytes(message) * SECONDS_PER_LETTER * 1000);

      state.messageTimings.push(messageMilliseconds);

      if (state.messageTimings.length === 1) {
        state.$timeout(() => removeMessage(state), messageMilliseconds);
      }
    }
  }

  clean () {
    let messages = stateMap.get(this).messages;
    messages.splice(0, messages.length);
  }

  remove (key) {
    let state = stateMap.get(this);

    var message = null,
      messageIndex = null,
      timingIndex = null,
      i = 0;

    while (i < state.messages.length && message === null) {
      if (!state.messages[i].permanent) {
        timingIndex = timingIndex === null ? 0 : timingIndex + 1;
      }
      if (state.messages[i].key === key) {
        message = state.messages[i].key;
        messageIndex = i;
      }
      i++;
    }

    if (message !== null) {
      state.messages.splice(messageIndex, 1);

      if (!message.permanent) {
        state.messageTimings.splice(timingIndex, 1);
      }
    }
  }

  getMessages () {
    return stateMap.get(this).messages;
  }
}

function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

function removeMessage (state) {
  let messageIndex = null,
    i = 0;

  while (i < state.messages.length && messageIndex === null) {
    if (!state.messages[i].permanent) {
      messageIndex = i;
    }
    i++;
  }

  state.messages.splice(messageIndex, 1);
  state.messageTimings.shift();

  if (state.messageTimings.length) {
    state.$timeout(() => removeMessage(state), state.messageTimings[0]);
  }
}