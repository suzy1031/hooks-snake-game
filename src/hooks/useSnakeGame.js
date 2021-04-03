import { useCallback, useEffect, useState } from 'react';
import {
  defaultInterval,
  defaultDifficulty,
  initialPosition,
  initialValues,
  Delta,
  Difficulty,
  Direction,
  DirectionKeyCodeMap,
  GameStatus,
  OppositeDirection,
} from '../constants';
import {
  initFields,
  isCollision,
  isEatingMyself,
  getFoodPosition,
} from '../utils';

let timer = null;

const unsubscribe = () => {
  // nul以外1以上の数値
  if (!timer) {
    return;
  }
  //タイマーを削除する関数
  clearInterval(timer);
};

const useSnakeGame = () => {
  // setState => 分割代入
  // const [first, second, third] = [1, 2, 3];
  // first => 1, second => 2, third => 3と代入される
  const [fields, setFields] = useState(initialValues);
  const [body, setBody] = useState([]);
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);
  // game内の時間
  // 一定間隔で蓮台リングがトリガーされる必要がある為、定義
  // => useEffectの依存変数の配列に使う必要がある為
  const [tick, setTick] = useState(0);

  // useEffect(() => {レンダリング後に実行される関数(コールバック)},[依存変数の配列])
  useEffect(() => {
    setBody([initialPosition]);
    //ゲームの中の時間を管理する
    const interval = Difficulty[difficulty - 1];
    // setInterval(() => {一定間隔ごとに実行する関数(コールバック)},[インターバルの長さ(ms)])
    timer = setInterval(() => {
      setTick((tick) => tick + 1);
    }, interval);
    return unsubscribe;
  }, [difficulty]);

  useEffect(() => {
    if (body.length === 0 || status !== GameStatus.playing) {
      return;
    }
    const canContinue = handleMoving();
    // canContinue => true / false
    // 壁にぶつかった場合 / 自分を食べた場合 => false
    if (!canContinue) {
      // gameOver
      unsubscribe();
      setStatus(GameStatus.gameOver);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const start = () => setStatus(GameStatus.playing);

  const stop = () => setStatus(GameStatus.suspended);

  // gameOver
  const reload = () => {
    // stateを初期化
    timer = setInterval(() => {
      setTick((tick) => tick + 1);
    }, defaultInterval);
    setStatus(GameStatus.init);
    setBody([initialPosition]);
    setDirection(Direction.up);
    setFields(initFields(fields.length, initialPosition));
  };

  // direction / statusのstateが更新される度にupdateDirectionの副作用が発生する
  const updateDirection = useCallback(
    (newDirection) => {
      if (status !== GameStatus.playing) {
        return;
      }
      // 進行方向の真逆には進めない
      if (OppositeDirection[direction] === newDirection) {
        return;
      }
      setDirection(newDirection);
    },
    [direction, status]
  );

  const updateDifficulty = useCallback(
    (difficulty) => {
      if (status !== GameStatus.init) {
        return;
      }
      if (difficulty < 1 || difficulty > Difficulty.length) {
        return;
      }
      setDifficulty(difficulty);
    },
    [status]
  );

  // updateDirectionの状態が更新される度にuseEffectの副作用が発生する
  useEffect(() => {
    const handleKeyDown = (e) => {
      // キーボード↑↓←→入力で方向を操作
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      }
      // handleKeyDown => updateDirection => setDirectionで新しいnewDirectionでstateを更新
      updateDirection(newDirection);
    };
    // イベント登録
    document.addEventListener('keydown', handleKeyDown);
    // イベント登録の解除(リソースの無駄遣いを防ぐ)
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [updateDirection]);

  const handleMoving = () => {
    const { x, y } = body[0];
    // 現在の位置から前後左右どちらに動いたか
    const delta = Delta[direction];
    // 現在の位置から動いた位置の座標を常にwatch
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y,
    };

    if (
      isCollision(fields.length, newPosition) ||
      isEatingMyself(fields, newPosition)
    ) {
      return false;
    }
    // 0:{x: 18, y:20}, 1{x: 18, y: 21}・・・の形でsnakeが成長する
    // useState以外で変更を加えるのでスプレッド演算子でコピーを作る
    const newBody = [...body];
    // エサを食べない場合 => bodyの末尾を消す
    if (fields[newPosition.y][newPosition.x] !== 'food') {
      // pop 配列から最後の要素を取り除き、その要素を返す(破壊的メソッド)
      // 破壊的メソッドはレシーバを書き換える => この場合はnewBody
      const removingTrack = newBody.pop();
      // popで取り出した配列最後の要素を初期化する
      fields[removingTrack.y][removingTrack.x] = '';
    } else {
      // エサを食べた場合 => 新しいエサを出現させる
      // 第二引数 => 現在のsnakeの座標位置
      const food = getFoodPosition(fields.length, [...newBody, newPosition]);
      fields[food.y][food.x] = 'food';
    }
    // エサを食べる場合 => bodyの末尾を消さず伸びる
    fields[newPosition.y][newPosition.x] = 'snake';
    // unshift 配列の最初に1つ以上の要素を追加し、新しい配列の長さを返す(破壊的メソッド)
    newBody.unshift(newPosition);

    setBody(newBody);
    setFields(fields);
    return true;
  };
  return {
    body,
    difficulty,
    fields,
    status,
    start,
    stop,
    reload,
    updateDirection,
    updateDifficulty,
  };
};

export default useSnakeGame;
