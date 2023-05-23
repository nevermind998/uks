import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getDummyPosts } from '../../api/example';
import { ExamplePost } from '../../Types/ExamplePost';
import { addExample } from '../../Store/slices/example.slice';
import { dispatch } from '../../Store';

const Example = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["FETCH_POSTS"],
        queryFn: async () => {
          const data = getDummyPosts();
          return data;
        },
    });

    useEffect(() => {
        if (data) {
            dispatch(addExample(data));
        }
    }, [data]);

    return (
        <div className="example">
            <h1>GitHub</h1>
            <div>
            {isLoading && <div>Please wait...</div>}
            {data &&
                data.map((post: ExamplePost) => (
                <a href="/" key={data.id}>
                    <p>{post.title}</p>
                 </a>
                ))}
            </div>
        </div>
    );
};

export default Example;
