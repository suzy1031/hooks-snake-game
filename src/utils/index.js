export const getFoodPosition = (fieldSize, excludes) => {
  // some関数がtrueを返す限りループする
  while (true) {
    // マス外を排除 -1
    // マスの際を排除(すぐ壁にぶつかるので) -1
    // 0始まり +1
    const x = Math.floor(Math.random() * (fieldSize - 1 - 1)) + 1;
    const y = Math.floor(Math.random() * (fieldSize - 1 - 1)) + 1;
    // some 関数はコールバックが一つでもtrueを返したらtrueを返す関数
    const conflict = excludes.some((item) => item.x === x && item.y === y);
    // whileを抜ける処理 => false
    if (!conflict) {
      return { x, y };
    }
  }
};

export const initFields = (fieldSize, snake) => {
  const fields = [];
  for (let i = 0; i < fieldSize; i++) {
    const cols = new Array(fieldSize).fill('');
    fields.push(cols);
  }
  fields[snake.y][snake.x] = 'snake';

  const food = getFoodPosition(fieldSize, [snake]);
  fields[food.y][food.x] = 'food';

  return fields;
};

export const isCollision = (fieldSize, position) => {
  if (position.y < 0 || position.x < 0) {
    // x, y のどちらかの座標がマイナスの値の時
    return true;
  }

  if (position.y > fieldSize - 1 || position.x > fieldSize - 1) {
    // x, y のどちらかの座標がフィールドサイズを超えてしまっている時
    return true;
  }

  return false;
};

export const isEatingMyself = (fields, position) => {
  return fields[position.y][position.x] === 'snake';
};
