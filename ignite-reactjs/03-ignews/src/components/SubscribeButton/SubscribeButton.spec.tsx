import { render, screen, fireEvent } from "@testing-library/react";
import { mocked } from 'ts-jest/utils'
import { useSession, signIn } from 'next-auth/client';
import { useRouter } from "next/router";
import { SubscribeButton } from ".";

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscribeButton component', () => {
  it('renders correcly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);
    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it('redirects user to posts when user already has subscription', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      { 
        user: { name: 'John Doe', email: 'john.doe@example.com' }, 
        activeSubscription: 'fake-active-subscription', 
        expires: 'fake-expires' 
      },
      true
    ]);

    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();
    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    render(<SubscribeButton />);
    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts');
  });
})