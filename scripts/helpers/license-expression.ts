type LicenseException = {
  package: string;
  license: string;
};

type LicenseExpressionAllowlist = {
  allowedLicenses: string[];
  exceptions: LicenseException[];
};

function tokenizeLicenseExpression(expression: string): string[] {
  return expression.replaceAll("(", " ( ").replaceAll(")", " ) ").split(/\s+/u).filter(token => token.length > 0);
}

class LicenseExpressionEvaluator {
  private index = 0;

  private readonly tokens: string[];

  public constructor(expression: string, private readonly packageName: string, private readonly allowlist: LicenseExpressionAllowlist) {
    this.tokens = tokenizeLicenseExpression(expression);
  }

  public isAllowed(): boolean {
    const isAllowed = this.isOrAllowed();

    this.ensureComplete();

    return isAllowed;
  }

  private ensureComplete(): void {
    if (!this.isComplete()) {
      throw new Error(`Unexpected token in license expression: ${this.peek() ?? "unknown"}.`);
    }
  }

  private isOrAllowed(): boolean {
    let isAllowed = this.isAndAllowed();

    while (this.peek()?.toUpperCase() === "OR") {
      this.index += 1;
      const isNextAllowed = this.isAndAllowed();

      isAllowed = isNextAllowed || isAllowed;
    }
    return isAllowed;
  }

  private isAndAllowed(): boolean {
    let isAllowed = this.isPrimaryAllowed();

    while (this.peek()?.toUpperCase() === "AND") {
      this.index += 1;
      const isNextAllowed = this.isPrimaryAllowed();

      isAllowed = isNextAllowed && isAllowed;
    }
    return isAllowed;
  }

  private isPrimaryAllowed(): boolean {
    const token = this.peek();

    if (token === "(") {
      this.index += 1;
      const isAllowed = this.isOrAllowed();

      this.expect(")");

      return isAllowed;
    }

    if (token === undefined || token === ")") {
      throw new Error("Unexpected end of license expression.");
    }
    this.index += 1;

    return this.isIdentifierAllowed(token);
  }

  private isIdentifierAllowed(token: string): boolean {
    if (this.peek()?.toUpperCase() !== "WITH") {
      return this.isTokenAllowed(token);
    }

    this.index += 1;
    const exception = this.peek();

    if (exception === undefined) {
      throw new Error("Missing license exception after WITH.");
    }
    this.index += 1;

    return this.isTokenAllowed(`${token} WITH ${exception}`);
  }

  private isTokenAllowed(token: string): boolean {
    const normalizedToken = token.replaceAll(/[()]/gu, "").trim();

    return this.allowlist.allowedLicenses.includes(normalizedToken) ||
      this.allowlist.exceptions.some(exception => exception.package === this.packageName && exception.license === normalizedToken);
  }

  private isComplete(): boolean {
    return this.index === this.tokens.length;
  }

  private peek(): string | undefined {
    return this.tokens[this.index];
  }

  private expect(token: string): void {
    if (this.peek() !== token) {
      throw new Error(`Expected "${token}" in license expression.`);
    }
    this.index += 1;
  }
}

function isLicenseExpressionAllowed(expression: string, packageName: string, allowlist: LicenseExpressionAllowlist): boolean {
  try {
    const evaluator = new LicenseExpressionEvaluator(expression, packageName, allowlist);

    return evaluator.isAllowed();
  } catch {
    return false;
  }
}

export type { LicenseExpressionAllowlist };

export { isLicenseExpressionAllowed };