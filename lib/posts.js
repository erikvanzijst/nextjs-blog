import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    console.log("getSortedPostsData()...");
    const filenames = fs.readdirSync(postsDirectory);
    const allPostsData = filenames.map( (fn) => {
        const id = fn.replace(/\.md$/, '');

        const absPath = path.join(postsDirectory, fn);
        const fileContents = fs.readFileSync(absPath, 'utf-8');

        const matterResult = matter(fileContents);

        return {
            id,
            ...matterResult.data
        };
    });

    return allPostsData.sort(({date: a}, {date: b}) => {
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
}
