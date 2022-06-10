import React, { useCallback, useRef, useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Table } from "antd";
import update from "immutability-helper";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const type = "DraggableBodyRow";

const DraggableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  const ref = useRef(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};

      if (dragIndex === index) {
        return {};
      }

      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward"
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    }
  });
  const [, drag] = useDrag({
    type,
    item: {
      index
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  console.log(ref);
  drop(drag(ref));
  return (
    <th
      ref={ref}
      className={`${className}${isOver ? dropClassName : ""}`}
      style={{
        cursor: "move",
        ...style
      }}
      {...restProps}
    />
  );
};

const App = () => {
  const [columns, setColumns] = useState([
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age"
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address"
    }
  ]);

  const [data, setData] = useState([
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park"
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park"
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park"
    }
  ]);
  const components = {
    body: {
      row: DraggableBodyRow
    }
  };
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      console.log("dragIndex", dragIndex, "-----", "hoiverIndex", hoverIndex);
      const dragRow = columns[dragIndex];
      console.log("dragRow", dragRow);
      setColumns(
        update(columns, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow]
          ]
        })
      );
    },
    [columns]
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        columns={columns}
        dataSource={data}
        components={components}
        onRow={(_, index) => {
          // console.log(index);
          const attr = {
            index,
            moveRow
          };
          // console.log(attr);
          return attr;
        }}
      />
    </DndProvider>
  );
};

export default App;
