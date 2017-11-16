import React from "react";
import { Link } from 'react-router-dom';
import "./NewsList.scss";

export default function NewsList({ news }) {
  return (
    <div className="newslist">
      <div className="header">
        <strong>Wizard News</strong>
        <Link to="/">Home</Link>
      </div>
      {news &&
        news.map(post =>
          <div key={post.id}>
            <p>
              {post.id} ⬆ {post.title}
            </p>
            <small>
              {post.upvotes} upvotes by {post.author}
            </small>
          </div>
        )}
    </div>
  );
}
