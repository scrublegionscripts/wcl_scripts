// You must be in Events Pane of Deaths and the PIN TYPE must be set to FILTER
const debuffs = new Map();

const ignoredIds = [424497, 425602, 426691, 424662];

const threshold = 200;

pinMatchesFightEvent = (event, fight) => {
  switch (event.type) {
    case "applydebuff": {
      if (event.target?.type === "Player" && ignoredIds.includes(event.ability.id)) {
        debuffs.set(event.target.id, {
          apply: event.timestamp,
          remove: 0,
        });
      }

      return false;
    }
    case "removedebuff": {
      if (event.target?.type === "Player" && ignoredIds.includes(event.ability.id)) {
        const meta = debuffs.get(event.target.id);
        meta.remove = event.timestamp;
        debuffs.set(event.target.id, meta);
      }

      return false;
    }
    case "death": {
      if (event.target?.type !== "Player") {
        return false;
      }

      if (ignoredIds.includes(event.killingAbility?.id)) {
        return false;
      }

      if (!debuffs.has(event.target.id)) {
        return true; // death unrelated to being rooted
      }    

      const meta = debuffs.get(event.target.id);

      if (meta.remove === 0) {
        return true; // was rooted on death
      }

      if (event.timestamp - meta.remove <= threshold) {
        return false; // removedebuff event from dying
      }

      return true;
    }
    default: {
      return false;
    }
  }
};

initializePinForFight = (fight) => {};