import { classNames } from 'shared/lib/classNames/classNames';
import {
    ChangeEvent,
    InputHTMLAttributes,
    memo,
    MutableRefObject,
    useEffect,
    useRef,
    useState,
} from 'react';
import cls from './Input.module.scss';

type HTMLInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange'
>;

interface InputProps extends HTMLInputProps {
    className?: string;
    value?: string | number;
    onChange?: (value: string) => void;
    readonly?: boolean;
}

export const Input = memo((props: InputProps) => {
    const {
        className,
        value,
        onChange,
        type = 'text',
        autoFocus = false,
        placeholder,
        readonly,
        ...otherProps
    } = props;
    const ref = useRef() as MutableRefObject<HTMLInputElement>;
    const placeholderRef = useRef() as MutableRefObject<HTMLSpanElement>;
    const [isFocused, setIsFocused] = useState(autoFocus);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (autoFocus) {
            ref.current?.focus();
        }
    }, [autoFocus]);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    const onFocusHandler = () => {
        setIsFocused(true);
    };

    const onBlurHandler = () => {
        setIsFocused(false);
    };

    useEffect(() => {
        if ((isFocused && placeholderRef.current) || value) {
            setTimeout(() => {
                setWidth(placeholderRef.current.offsetWidth - 3);
            }, 120);
        }
    }, [placeholderRef, isFocused, props, value]);

    return (
        <div className={cls.container}>
            <input
                className={classNames(cls.input, { [cls.readonly]: readonly }, [
                    className,
                ])}
                ref={ref}
                type={type}
                value={value}
                onChange={onChangeHandler}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                readOnly={readonly}
                {...otherProps}
            />
            {placeholder && (
                <>
                    <span
                        style={{
                            width: isFocused || value ? width : 0,
                        }}
                        className={classNames(cls.sep, {
                            [cls.focused]: isFocused || value,
                        })}
                    />
                    <span
                        ref={placeholderRef}
                        className={classNames(cls.placeholder, {
                            [cls.focused]: isFocused || value,
                        })}
                    >
                        {placeholder}
                    </span>
                </>
            )}
        </div>
    );
});
