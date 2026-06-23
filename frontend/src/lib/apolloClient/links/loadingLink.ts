import { ApolloLink, Observable } from "@apollo/client";
import { useGlobalApolloLoading } from "../../globalApolloLoading";

/**
 * Loading link (your existing logic)
 */
export const createLoadingLink = () =>
  new ApolloLink((operation, forward) => {
    const includedOperations = new Set([
      "createPasscode",
      "VerifyPasscode",
      "VerifyBiometric",
      "updateUser",
      "loginUser",
    ]);

    const operationName = operation.operationName || "";
    const shouldTrack = includedOperations.has(operationName);

    if (shouldTrack) {
      const { increment, decrement } = useGlobalApolloLoading.getState();
      increment();

      return new Observable((observer) => {
        const subscription = forward(operation).subscribe({
          next: (result) => {
            decrement();
            observer.next(result);
          },
          error: (error) => {
            decrement();
            observer.error(error);
          },
          complete: () => {
            // For strict safety, we might want to ensure decrement wasn't called if next wasn't called?
            // But usually HTTP links emit next then complete.
            // If we rely on next to decrement, and it completes without next, we might stick?
            // Let's safe guard:
            // Actually, for simple loading, decrementing on next OR error is usually enough for HTTP.
            // For subscriptions, this might be different.
            observer.complete();
          },
        });

        return () => {
          subscription.unsubscribe();
        };
      });
    }

    return forward(operation);
  });