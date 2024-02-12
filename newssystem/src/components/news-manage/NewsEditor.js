import React, { useState, useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default function NewsEditor(props) {
    const [editorState, seteditorState] = useState("");
    useEffect(() => {
        // console.log(props.content,props.content.length)
        const html1 =props.content
        // const html = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
        // console.log(typeof html1,"-",typeof html)
        if(html1===undefined)return;
        // console.log(typeof html1)
        // const contentBlock = htmlToDraft(html1.trim());
        const contentBlock = htmlToDraft(html1.trim());
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            seteditorState(editorState)
        }
    }, [props.content]);
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => {
                    seteditorState(editorState)
                }}
                onBlur={() => {
                    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
