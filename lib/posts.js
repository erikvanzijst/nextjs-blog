import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {remark} from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts');

export function getAllPostIds() {
    const fns = fs.readdirSync(postsDirectory);
    return fns.map((fn) => {
        return {
            params: {
                id: fn.replace(/\.md/, ''),
            },
        }
    });
}

/**
 * Used on the homepage to display a list of all posts.
 *
 * @returns {{[p: string]: any, id: *}[]}
 */
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

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const contents = fs.readFileSync(fullPath, 'utf-8');

    const matterResult = matter(contents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        ...matterResult.data
    };

}