import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
/**
 * TODO: CHANGE Z INDEX OF THE CHART (KEEPS clashing with the navbar)
 *       Change font color for the y axis
 * @param {*} visitedCourses
 * @returns
 */
const displayChart = (visitedCourses) => {
    if (visitedCourses.length === 0) {
        return null;
    }

    const data = [];
    const categories = [
        "create",
        "evaluate",
        "analyse",
        "apply",
        "understand",
        "remember",
        "none",
    ];

    categories.forEach((category) => {
        const obj = { category };

        visitedCourses.forEach((course) => {
            const info = course.info.find((c) => c.category === category);
            obj[course.code] = info ? info.value : 0;
        });

        data.push(obj);
    });

    const maxValue = Math.max(
        ...data.map((obj) => {
            Object.values(obj)
                .filter((v) => typeof v === "number")
                .reduce((sum, v) => sum + v, 0);
        })
    );

    const xAxisTicks = [
        0,
        maxValue * 0.25,
        maxValue * 0.5,
        maxValue * 0.75,
        maxValue,
    ];

    return (
        <div
            id="analysis-chart"
            style={{ width: "100%", height: "300px", marginTop: "5em" }}
            className="bg-gray-200"
        >
            <ResponsiveContainer>
                <BarChart
                    layout="vertical"
                    width={800}
                    height={300}
                    data={data}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        domain={[0, maxValue]}
                        ticks={xAxisTicks}
                    />
                    <YAxis dataKey="category" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    {visitedCourses.map((course) => (
                        <Bar
                            key={course.code}
                            dataKey={course.code}
                            fill={`#${Math.floor(
                                Math.random() * 16777215
                            ).toString(16)}`}
                            name={course.code}
                            stackId="a"
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default displayChart;
