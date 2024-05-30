import { BarChart, Bar, XAxis, YAxis } from "recharts";

function Graph (props){
    const {agree, disagree} = props
    const data = [
      {
        name: "찬성",
        num: agree
      },
      {
        name: "반대",
        num: disagree
      },
    ];
  
    return (
        <BarChart width={300} height={200} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="num" fill="#8C0327" />
        </BarChart>
    );
  };

export default Graph;