import React from 'react';

// フィールドのデータは二次元配列
// const field = [
//  ['', 'food', '', '', ''],
//  ['', '', '', '', ''],
//  ['', '', '', '', ''],
//  ['', '', '', '', ''],
//  ['', '', 'snake', '', ''],
//]
const Field = ({ fields }) => {
  return (
    <div className='field'>
      {/* 縦の長さ分をループ */}
      {fields.map((row) => {
        // 横の長さ分をループ
        return row.map((column) => {
          return <div className={`dots ${column}`}></div>;
        });
      })}
    </div>
  );
};

export default Field;
