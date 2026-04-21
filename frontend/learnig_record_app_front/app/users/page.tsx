// これが「画面の枠（Reactコンポーネント）」
export default function UsersPage() {
    return (
      <main>
        <h1>ユーザー一覧</h1>
        <p>ここにLaravelから取得したデータが表示されます。</p>
        
        {/* HTMLタグをそのまま書く感覚でOK（JSXと言います） */}
        <ul>
          <li>ユーザーA</li>
          <li>ユーザーB</li>
        </ul>
      </main>
    );
  }