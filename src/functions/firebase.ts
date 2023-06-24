type ErrorMethod =
  | "signup"
  | "signin/popup"
  | "signin"
  | "send-confirm-mail"
  | "reset-password"
  | "new-password"
  | "verify-email";

/**
 * @description Firebaseから送られるエラーメッセージを日本語に変換
 * @param {string} code エラーコード
 * @param {('signup' | 'signin/popup' | 'signin')} method エラー時のメソッド
 * @returns {string}
 */
export const convertErrorMessageFromEnToJa = (
  code: string,
  method: ErrorMethod
): string | null => {
  switch (code) {
    case "auth/cancelled-popup-request":
    case "auth/popup-closed-by-user":
      return "処理が中断されました。もう一度はじめからやり直してください";
    case "auth/email-already-in-use":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "認証に失敗しました。提供されたメールアドレスまたはパスワードが正しくありません";
    case "auth/invalid-email":
      return "認証に失敗しました。メールアドレスの形式が正しくありません";
    case "auth/user-disabled":
      return "認証に失敗しました。サービスの利用が停止されています";
    case "auth/user-mismatch":
      if (method === "signin/popup") {
        return "認証されているユーザーと異なるアカウントが選択されました";
      } else {
        return "認証に失敗しました。提供されたメールアドレスまたはパスワードが正しくありません";
      }
    case "auth/weak-password":
      return "パスワードは6文字以上にしてください";
    case "auth/popup-blocked":
      return "認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください";
    case "auth/operation-not-supported-in-this-environment":
    case "auth/auth-domain-config-required":
    case "auth/operation-not-allowed":
    case "auth/unauthorized-domain":
      return "現在この認証方法はご利用頂けません";
    case "auth/requires-recent-login":
      return "認証の有効期限が切れています";
    case "auth/too-many-requests":
      if (method === "signin") {
        return "ログインに何度も失敗したため、このアカウントへのアクセスは一時的に無効になっています。パスワードをリセットすることですぐに復旧させるか、後でもう一度試してください。";
      } else if ("send-confirm-mail") {
        return "一定時間内の呼び出し上限を超えました。後でもう一度試してください。";
      }
    case "auth/invalid-action-code":
    case "auth/expired-action-code":
      return "メールアドレスの確認のリクエストの期限が切れたか、リンクがすでに使用されています";
    case "auth/invalid-credential":
      return "ユーザー情報の識別情報が不正であるか、期限切れである可能性があります。ログインし直してください。";
    case "auth/invalid-verification-code":
      return "";
    default:
      if (method.indexOf("signin") !== -1) {
        return "認証に失敗しました。しばらく時間をおいて再度お試しください";
      } else {
        return "エラーが発生しました。すでに別のアカウントをお持ちの方は、同じメールアドレスを登録しようとしていないかご確認ください。";
      }
  }
};
